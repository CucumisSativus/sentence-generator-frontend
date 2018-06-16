import './Haiku';

export default interface HaikuRowProps {
    haiku: Haiku;
    onHaikuEdited: (haiku: Haiku) => void;
    bootstrapSize: string;
}