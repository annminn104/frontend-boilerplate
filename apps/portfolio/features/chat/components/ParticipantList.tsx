import { type Participant } from '../types/chat'

interface ParticipantListProps {
  participants: Participant[]
  currentUserId: string
}

export function ParticipantList({ participants, currentUserId }: ParticipantListProps) {
  return (
    <div className="space-y-2">
      {participants.map(participant => (
        <div key={participant.id} className="flex items-center">
          <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm">
            {participant.user.email}
            {participant.userId === currentUserId ? ' (you)' : ''}
          </span>
        </div>
      ))}
    </div>
  )
}
