import React, { useCallback, useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";

const CustomTextFilter = forwardRef((props, ref) => {
    const [filterText, setFilterText] = useState("");
    const refInput = useRef(null);

    const doesFilterPass = useCallback((params) => {
        const { node } = params;
        const value = props.valueGetter({ data: node.data }) || "";

        if (!filterText) return true;

        // Convert both filter text and value to lowercase for case-insensitive comparison
        const filterValues = filterText
            .toLowerCase()
            .split(";")
            .map((filterWord) => filterWord.trim());
        return filterValues.some((filterWord) => value.toLowerCase() === filterWord);
    }, [filterText, props]);

    useImperativeHandle(ref, () => ({
        isFilterActive() {
            return filterText !== "";
        },
        doesFilterPass,
        getModel() {
            return filterText ? { value: filterText } : null;
        },
        setModel(model) {
            setFilterText(model ? model.value : "");
        },
        afterGuiAttached() {
            refInput.current.focus();
        },
    }));

    const onChangeHandler = (event) => {
        const newValue = event.target.value;
        setFilterText(newValue);
        props.filterChangedCallback();
    };

    return (
        <div className="custom-text-filter">
            <input
                type="text"
                ref={refInput}
                value={filterText}
                onChange={onChangeHandler}
                placeholder="Enter values separated by semicolons..."
                style={{ width: "100%" }}
            />
            <small>Matches exact values, e.g., "id1;id2;id3".</small>
        </div>
    );
});

export default CustomTextFilter;
