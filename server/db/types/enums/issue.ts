export enum Type {
    DOWN = 'Game Down',
    SAFTEY = 'Safety Issue',
    CLEANING = 'Needs Cleaning',
    NON_CRITICAL = 'Non-Critical Issue'
}
export enum Status {
    REPORTED = 'Reported (Unconfirmed)',
    CONFIRMED = 'Confirmed',
    AWAITING_RESOLUTION = 'Awaiting Resolution',
    RESOLVED = 'Issue Resolved'
}