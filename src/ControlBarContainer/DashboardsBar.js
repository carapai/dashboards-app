import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import ControlBar from 'd2-ui/lib/controlbar/ControlBar';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import Chip from 'd2-ui/lib/chip/Chip';

import D2IconButton from '../widgets/D2IconButton';
import Filter from './Filter';
import {
    CONTROL_BAR_OUTER_HEIGHT_DIFF,
    CONTROL_BAR_ROW_HEIGHT,
} from './ControlBarContainer';

import * as fromActions from '../actions';
import * as fromReducers from '../reducers';
import { orObject } from '../util';
import { blue800 } from '../../../d2-ui/node_modules/material-ui/styles/colors';

const dashboardBarStyles = {
    scrollWrapper: {
        padding: '10px 6px 0 6px',
    },
    expandButtonWrap: {
        textAlign: 'center',
    },
};

const EXPANDED_ROW_COUNT = 10;

const getInnerHeight = (isExpanded, rows) =>
    (isExpanded ? EXPANDED_ROW_COUNT : rows) * CONTROL_BAR_ROW_HEIGHT;

const getOuterHeight = (isExpanded, rows) =>
    getInnerHeight(isExpanded, rows) + CONTROL_BAR_OUTER_HEIGHT_DIFF;

const onDashboardSelectWrapper = (id, onClick) => () => onClick(id);

const DashboardsBar = ({
    controlsStyle,
    dashboards,
    name,
    rows,
    isExpanded,
    onChangeHeight,
    onToggleExpanded,
    onNewClick,
    onChangeFilterName,
    onDashboardSelect,
}) => {
    const style = Object.assign({}, controlsStyle, dashboardBarStyles);
    const contentWrapperStyle = Object.assign(
        {},
        dashboardBarStyles.scrollWrapper,
        { overflowY: isExpanded ? 'auto' : 'hidden' },
        { height: getInnerHeight(isExpanded, rows) }
    );

    const controlBarHeight = getOuterHeight(isExpanded, rows);

    return (
        <ControlBar
            height={controlBarHeight}
            onChangeHeight={onChangeHeight}
            editMode={false}
            expandable={!isExpanded}
        >
            <div style={contentWrapperStyle}>
                <div style={style.leftControls}>
                    <Fragment>
                        <D2IconButton
                            style={{
                                width: 36,
                                height: 36,
                                marginRight: 10,
                            }}
                            onClick={onNewClick}
                        />
                        <Filter name={name} onChangeName={onChangeFilterName} />
                    </Fragment>
                </div>
                <div style={style.rightControls}>
                    <div
                        style={{
                            position: 'relative',
                            top: '6px',
                            left: '-10px',
                            cursor: 'pointer',
                        }}
                        onClick={() => alert('show list view')}
                    >
                        <SvgIcon icon="List" />
                    </div>
                </div>
                {dashboards.map(dashboard => (
                    <Chip
                        key={dashboard.id}
                        label={dashboard.name}
                        avatar={dashboard.starred ? 'star' : null}
                        onClick={onDashboardSelectWrapper(
                            dashboard.id,
                            onDashboardSelect
                        )}
                    />
                ))}
            </div>
            <div style={style.expandButtonWrap}>
                <div
                    onClick={onToggleExpanded}
                    style={{
                        paddingTop: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        color: blue800,
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        visibility: 'visible',
                    }}
                >
                    {isExpanded ? 'Show less' : 'Show more'}
                </div>
            </div>
        </ControlBar>
    );
};

const mapStateToProps = state => {
    const { fromDashboards, fromFilter } = fromReducers;

    return {
        dashboards: fromDashboards.sGetFromState(state),
        name: fromFilter.sGetFilterName(state),
        rows: (state.controlBar && state.controlBar.rows) || 1,
        isExpanded:
            state.controlBar.expanded &&
            state.controlBar.rows < EXPANDED_ROW_COUNT,
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { dashboards, name, rows, isExpanded } = stateProps;
    const { dispatch } = dispatchProps;
    const { fromControlBar, fromFilter, fromSelected } = fromActions;

    const filteredDashboards = Object.values(orObject(dashboards)).filter(
        d => d.name.toLowerCase().indexOf(name) !== -1
    );

    return {
        ...stateProps,
        ...ownProps,
        dashboards: [
            ...filteredDashboards.filter(d => d.starred),
            ...filteredDashboards.filter(d => !d.starred),
        ],
        onChangeHeight: (newHeight, onEndDrag) => {
            const newRows = Math.max(
                1,
                Math.floor((newHeight - 24) / CONTROL_BAR_ROW_HEIGHT)
            );

            if (newRows !== rows) {
                dispatch(
                    fromControlBar.acSetControlBarRows(
                        Math.min(newRows, EXPANDED_ROW_COUNT)
                    )
                );
            }
        },
        onNewClick: () => dispatch(fromSelected.tNewDashboard()),
        onToggleExpanded: () => {
            dispatch(fromControlBar.acSetControlBarExpanded(!isExpanded));
        },
        onChangeFilterName: name => dispatch(fromFilter.acSetFilterName(name)),
        onDashboardSelect: id =>
            dispatch(fromSelected.tSetSelectedDashboardById(id)),
    };
};

const DashboardsBarContainer = connect(mapStateToProps, null, mergeProps)(
    DashboardsBar
);

export default DashboardsBarContainer;