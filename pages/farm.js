import SingleFarm from '../components/SingleFarm';

const Farm = props => (
    <div>
        <SingleFarm id={props.query.id} />
    </div>
)

export default Farm;