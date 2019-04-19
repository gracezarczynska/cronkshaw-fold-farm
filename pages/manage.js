import SubscriptionManagement from '../components/SubscriptionManagement';

const Manage = props => (
    <div>
      <SubscriptionManagement subscription={props.query.id} />
    </div>
);
  
export default Manage;