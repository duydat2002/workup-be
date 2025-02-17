import User from '@/models/user'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as LocalStrategy } from 'passport-local'

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async function (req, email, password, done: any) {
      try {
        const user = await User.findOne({ email: email })

        if (!user) return done(null, false, { message: 'Incorrect email.' })
        if (!user.emailVerified) return done(null, false, { message: 'Email not verified.' })
        if (!user.password || user.password == '')
          return done(null, false, { message: 'The account does not have a password.' })

        const isMatch = user.verifyPassword(password)
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile) return done(null, false, { message: 'Authentication failed.' })

        let user = await User.findOne({ email: profile.emails?.[0]?.value })

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id
            user.emailVerified = true
            await user.save()
          }
        } else {
          user = await new User({
            googleId: profile.id,
            email: profile?.emails?.[0]?.value,
            emailVerified: true,
            fullname: profile.displayName,
            avatar: profile.photos?.[0]?.value
          }).save()
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  )
)

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id, { password: 0 })
    done(null, user)
  } catch (err) {
    done(err)
  }
})

export default passport
