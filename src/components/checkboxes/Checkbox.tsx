import { useState } from "react";
import "./checkbox.css";

interface CheckboxProps {
    text: string;
}

export default function Checkbox({ text }: CheckboxProps) {
    const [checked, setChecked] = useState(false);

    return (
        <label className="checkbox__item__label">
            <input
                type="checkbox"
                checked={checked}
                onChange={() => setChecked(!checked)}
            />
            {text}
        </label>
    );
}
