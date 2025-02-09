import firebase, { ServiceAccount } from 'firebase-admin'

import serviceAccount from '../../firebase-admin.json'

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: 'gs://workwise-d7df1.appspot.com'
})

export default firebase
