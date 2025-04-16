interface TodoProps {
    text: string;
}

export default function Todo({text}: TodoProps) {
    return <>{text}</>;
}
