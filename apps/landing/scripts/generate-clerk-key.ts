import crypto from 'crypto'

const key = crypto.randomBytes(32).toString('hex')
console.log('CLERK_ENCRYPTION_KEY:', key)
