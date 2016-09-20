import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Loader } from '../../utils';
import AuditRow from './AuditRow';
import { refreshAuditRequest } from '../actions';

function sortByName(a, b) {
  return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
}

class Audit extends Component {
  render() {
    const { characters, isLoading, isRefreshingAudit, lastRefreshed } = this.props;

    let lastRefreshedElement = <b>never</b>;
    if (lastRefreshed) {
      const parsed = moment(lastRefreshed);
      lastRefreshedElement = <time dateTime={parsed.toISOString()}>{parsed.fromNow()}</time>;
    }

    let i = 0;
    return <section id="audit" className="page">
      {isLoading && <div className="loader-container"><Loader /></div>}
      {!isLoading && <div className="audit-table">
        <div className="link-group title">
          {!isRefreshingAudit && <span>Last refreshed: {lastRefreshedElement}</span>}
          {!isRefreshingAudit && '('}
          {!isRefreshingAudit && <a href="javascript:void(0)" onClick={this.props.refreshAudit}>refresh now</a>}
          {!isRefreshingAudit && ')'}
          {isRefreshingAudit && <span>Refreshing <Loader small={true} /></span>}
        </div>
        <table>
          <thead>
            <tr>
              <th>Character</th>
              <th title="Item Level (Equipped)">Ilvl</th>
              <th title="Neck Enchant">N</th>
              <th title="Cloak Enchant">C</th>
              <th title="Ring1 Enchant">R1</th>
              <th title="Ring 2 Enchant">R2</th>
              <th title="Sockets">Sockets</th>
              <th width="100%"></th>
            </tr>
          </thead>
          <tbody>
            {characters.sort(sortByName).map(c => <AuditRow key={i++} {...c} />)}
          </tbody>
        </table>
      </div>}
    </section>;
  }
}

const mapStateToProps = state => ({
  characters: state.characters.characters,
  isLoading: state.characters.isLoading,
  isRefreshingAudit: state.characters.isRefreshingAudit,
  lastRefreshed: state.characters.lastRefreshed
});

const mapDispatchToProps = {
  refreshAudit: refreshAuditRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Audit);