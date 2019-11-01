import SubscriptionManagement from '../components/ManageSubscriptionJourney/SubscriptionManagement';

const Manage = props => (
    <div>
      <SubscriptionManagement enrollment={props.query.id} />
    </div>
);
  
export default Manage;