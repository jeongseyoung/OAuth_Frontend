import { ChangeEvent, KeyboardEvent, forwardRef } from "react";
import "./style.css";

interface Props {
  title: string;
  placeholder: string;
  type: "text" | "password";
  value: string;
  errorMessage?: string;
  isError?: boolean;
  buttonTitle?: string; // ? -> 와도되고 안와도되고
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onButtonClick?: () => void;
}

export const InputBox = forwardRef<HTMLInputElement, Props>(
  (props: Props, ref) => {
    const {
      title,
      placeholder,
      type,
      value,
      errorMessage,
      isError,
      buttonTitle,
      onChange,
      onButtonClick,
      onKeyDown,
    } = props;

    const buttonClass =
      value === "" ? "input-box-button-disable" : "input-box-button";

    const errorClass = isError
      ? "input-box-message-error"
      : "input-box-message";

    return (
      <div className="input-box">
        <div className="input-box-title">{title}</div>
        <div className="input-box-content">
          <div className="input-box-body">
            <input
              ref={ref}
              className="input-box-input"
              type={type}
              onChange={onChange}
              value={value}
              onKeyDown={onKeyDown}
              placeholder="아이디를 입력해 주세요"
            />
            {buttonTitle !== undefined && onButtonClick !== undefined && (
              <div className={buttonClass} onClick={onButtonClick}>
                {buttonTitle}
              </div>
            )}
          </div>
          {errorMessage !== undefined && (
            <div className={errorClass}>{errorMessage}</div>
          )}
        </div>
      </div>
    );
  }
);
