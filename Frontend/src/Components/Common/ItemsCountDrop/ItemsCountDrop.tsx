import React, { useState, useRef, useEffect } from 'react';
import "./ItemsCountDrop.css";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Redux/Store';
import { setItemsPerPage } from '../../../Redux/VacationsSlice';

function ItemsCountDrop({ options }: { options: number[] }): JSX.Element {

    const itemsPerPage = useSelector((state: RootState) => state.vacations.itemsPerPage);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<number | null>(itemsPerPage);
    const dropDownRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    const handleSelect = (value: number): void => {
        setSelectedValue(value);
        setIsOpen(false);
        dispatch(setItemsPerPage(value))
    };

    const handleBlur = (): void => {
        setIsOpen(false);
    };

    const toggleDropdown = (): void => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent): void => {
        if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
            handleBlur();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside as EventListener);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside as EventListener);
        };
    }, []);

    return (
        <div className="ItemsCountDrop" ref={dropDownRef}>
            <div className="dropdown" onClick={toggleDropdown}>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 512 512"><path d="M448 96V224H288V96H448zm0 192V416H288V288H448zM224 224H64V96H224V224zM64 288H224V416H64V288zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z" /></svg>
                </div>
                <div className="selected-value">{selectedValue}</div>
                {isOpen && (
                    <div className="options">
                        {options.map((option) => (
                            <div key={option} onClick={() => handleSelect(option)} className="option">
                                {option}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ItemsCountDrop;
