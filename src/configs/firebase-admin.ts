import 'dotenv/config'
import firebase, { ServiceAccount } from 'firebase-admin'

import serviceAccount from '../../firebase-admin.json'

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: process.env.STORAGE_BUCKET || ''
})

export default firebase
