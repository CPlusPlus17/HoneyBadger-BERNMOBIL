import React from "react";

// the UI component for filtering the subway entrances by subway line
export default props => {
    const { lines, filterLines } = props;

    // this is the JSX that will become the Filter UI in the DOM, notice it looks pretty similar to HTML
    // notice in the select element onChange is set to the updateFilter method
    // thus when a user selects a new subway line to view, the component passes the new filter value
    // to the parent component, Map, which reloads the GeoJSON data with the current filter value
    /*   return (
        <div className="filterSubwayLines">
            <select defaultValue="*" type="select" name="filterlines" onChange={e => filterLines(e)}>
                {lines.map((line, i) => {
                    return (
                        <option value={line} key={i}>
                            {line}
                        </option>
                    );
                }, this)}
            </select>
        </div>
    ); */
};
