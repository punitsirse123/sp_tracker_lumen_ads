import { OptionalId, Document, ObjectId } from 'mongodb';

export default interface User extends OptionalId<Document> {
  _id?: ObjectId
  email: string
  password: string
  requestsRemaining: number
}

