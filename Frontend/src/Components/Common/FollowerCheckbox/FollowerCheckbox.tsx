import { SyntheticEvent, useCallback } from "react";
import "./FollowerCheckbox.css";

interface FollowerProps {
    follower: {
        isFollower: boolean,
        onFollower: (isFollower: boolean) => void,
        followersCount: number
    }
}

function FollowerCheckbox({ follower }: FollowerProps): JSX.Element {
    const { isFollower, onFollower, followersCount } = follower;

    const onChange = useCallback((e: SyntheticEvent<HTMLInputElement>) => {
        onFollower(e.currentTarget.checked);
    }, [])

    return (
        <div className="FollowerCheckbox">
            <label className="container">
                <input onChange={onChange}
                    value="favorite-button"
                    name="favorite-checkbox"
                    id="favorite"
                    type="checkbox"
                    checked={isFollower}
                />
                <svg
                    className="feather feather-heart"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    ></path>
                </svg>
                <div className="action">
                    <span className="option-1">{followersCount}</span>
                    <span className="option-2">{followersCount}</span>
                </div>
            </label>
        </div>
    );
}

export default FollowerCheckbox;
