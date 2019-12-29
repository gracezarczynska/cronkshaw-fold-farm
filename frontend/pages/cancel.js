import React, { Component } from 'react';
import CancelSubscription from '../components/ManageSubscriptionJourney/CancelSubscription';

const Cancel = props => (
  <div>
    <CancelSubscription id={props.query.id} />
  </div>
);

export default Cancel;
