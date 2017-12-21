// @flow
import * as React from 'react';
import { isEqual } from 'lodash';
import moment from 'moment';

import { makeCancelable, type CancelablePromise } from 'utils/promise';

export type IntervalSettings = {
  interval: number,
  startTime: string,
  endTime: string
};

export default function HOCFetcher(
  WrappedComponent: React.ComponentType<any>,
  request: (any, any, ?boolean) => Promise<*>,
  needsFetch?: (any, any) => boolean,
  fetchInterval?: (any, any) => ?IntervalSettings
) {
  return class Fetcher extends React.Component<
    any,
    {
      data: ?any,
      isLoading: boolean,
      fetchError: string
    }
  > {
    promise: CancelablePromise;
    intervalSettings: ?IntervalSettings;
    refetchInterval: ?number;
    startTimeout: ?number;
    endTimeout: ?number;

    constructor(props: any) {
      super(props);
      this.state = {
        data: null,
        isLoading: false,
        fetchError: ''
      };
    }

    componentWillMount() {
      this.fetchData(this.props);
      if (fetchInterval) {
        this.setInterval(fetchInterval(this.props));
      }
    }

    componentWillReceiveProps(nextProps: any) {
      if (fetchInterval) {
        this.setInterval(fetchInterval(nextProps));
      }

      if (needsFetch && needsFetch(nextProps, this.props)) {
        this.fetchData(nextProps, this.props);
      }
    }

    fetchData(props: any, prevProps: any, refetch?: boolean) {
      if (this.promise) {
        this.promise.cancel();
      }

      this.setState({
        isLoading: true,
        fetchError: ''
      });
      // give request access to the last fetched data so it can memoize
      this.promise = makeCancelable(
        request({ ...props, prevData: this.state.data }, prevProps, refetch)
      );

      this.promise.promise
        .then(data => {
          this.setState({ data, isLoading: false });
        })
        .catch(e => {
          if (!e.isCanceled) {
            this.setState({
              isLoading: false,
              fetchError: (e.error && e.error.message) || ''
            });
          }
        });
    }

    setInterval(intervalSettings: ?IntervalSettings) {
      if (!isEqual(intervalSettings, this.intervalSettings)) {
        this.intervalSettings = intervalSettings;
        if (this.refetchInterval) {
          clearInterval(this.refetchInterval);
          this.refetchInterval = null;
        }
        if (this.startTimeout) {
          clearTimeout(this.startTimeout);
          this.startTimeout = null;
        }
        if (this.endTimeout) {
          clearTimeout(this.endTimeout);
          this.endTimeout = null;
        }

        if (intervalSettings) {
          const startTime = moment(intervalSettings.startTime, 'HH:mm:ss A');
          const endTime = moment(intervalSettings.endTime, 'HH:mm:ss A');
          const today = moment();

          if (endTime.isBefore(startTime)) {
            if (!today.isBetween(endTime, startTime)) {
              return this.initiateRefetching();
            } else {
              return this.startInterval();
            }
          } else if (today.isBetween(startTime, endTime)) {
            return this.initiateRefetching();
          } else {
            return this.startInterval();
          }
        }
      }
    }

    startInterval() {
      if (this.intervalSettings) {
        const startTime = moment(this.intervalSettings.startTime, 'HH:mm:ss A');
        const today = moment();
        if (today.isAfter(startTime)) {
          startTime.add(1, 'days');
        }

        const time = moment.duration(startTime.diff(today)).asMilliseconds();
        this.startTimeout = setTimeout(() => {
          this.initiateRefetching();
          this.startTimeout = null;
        }, time);
      }
    }

    endInterval() {
      if (this.intervalSettings) {
        const endTime = moment(this.intervalSettings.endTime, 'HH:mm:ss A');
        const today = moment();
        if (endTime.isBefore(today)) {
          endTime.add(1, 'days');
        }

        const endDuration = moment
          .duration(endTime.diff(today))
          .asMilliseconds();

        this.endTimeout = setTimeout(() => {
          if (this.refetchInterval) {
            clearInterval(this.refetchInterval);
            this.refetchInterval = null;
          }
          this.endTimeout = null;
          this.startInterval();
        }, endDuration);
      }
    }

    initiateRefetching() {
      if (this.intervalSettings) {
        this.refetchInterval = setInterval(() => {
          this.fetchData(this.props, {}, true);
        }, this.intervalSettings.interval);
      }

      this.endInterval();
    }

    componentWillUnmount() {
      if (this.promise) {
        this.promise.cancel();
      }

      if (this.refetchInterval) {
        clearInterval(this.refetchInterval);
      }
      if (this.startTimeout) {
        clearTimeout(this.startTimeout);
      }
      if (this.endTimeout) {
        clearTimeout(this.endTimeout);
      }
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          data={this.state.data}
          isLoading={this.state.isLoading}
          fetchError={this.state.fetchError}
        />
      );
    }
  };
}



// WEBPACK FOOTER //
// ./src/components/Fetcher/index.js