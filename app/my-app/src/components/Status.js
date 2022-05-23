

/**
 * Status Component
 * displays details associated with current activity in map - component will render multple time for each object in the map
 * renders each mapped activity object from data
 * @param {*} props 
 * @returns 
 */
export default function Status(props) {



    return (
        <div className="table">
            <header>
                <div className="col">Name:</div>
                <div className="col">Status:</div>
                <div className="col">date:</div>
            </header>
            <div className="row">
                <div className="col">{props.activity.name}</div>
                <div className="col">{props.activity.status === true ? <span id="in">IN</span> : <span id="out">OUT</span>}</div>
                <div className="col">{props.activity.date}</div>
            </div>
        </div>
    );

}