import React from "react";

export default function CargoInput({ value, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor="role">Cargo</label>
      <select id="role" value={value} onChange={onChange}>
        <option value="" disabled hidden>
          {placeholder || "Selecione"}
        </option>
        <option value="professor">Professor</option>
        <option value="aluno">Aluno</option>
        <option value="tutor">Tutor</option>
      </select>
    </div>
  );
}
