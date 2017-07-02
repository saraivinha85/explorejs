/**
 * This component will initialize all necessary explorejs modules and put instance in component context so nested components can use it!!
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {configuration} from 'explorejs-lib';

class Deferred {
    constructor() {
        this.promise = new Promise((fulfill, reject) => {
            this.fulfill = fulfill;
            this.reject = reject;
        });
    }
}

export default class LocalBinding extends Component {

    constructor(props) {
        super(props);

        const configPromise = configuration(props, props.preset);

        this.state = {configPromise, deferred: new Deferred()};

    }

    async componentDidMount() {
        const config = await this.state.configPromise;

        this.props.series.forEach(s => config.createSerieCache(s));

        config.setThrottle(this.props.throttleNetwork);

        this.state.deferred.fulfill(config);
    }

    async componentWillReceiveProps(newProps) {
        if (newProps.throttleNetwork !== this.props.throttleNetwork) {
            const conf = await this.state.configPromise;

            conf.setThrottle(newProps.throttleNetwork);
            // todo handle 404
            // todo handle multisupprs
        }
    }

    componentWillUnmount() {
        this.state.configPromise.then(s => s.destroy());
    }

    getChildContext() {
        return {
            explorejsConfiguration: this.state && this.state.deferred.promise
        };
    }

    render() {
        return React.Children.only(this.props.children);
    }

    static propTypes = {
        manifest: PropTypes.string,
        batch: PropTypes.string,
        series: PropTypes.arrayOf(PropTypes.string),
        preset: PropTypes.object
    };

    static childContextTypes = {
        explorejsConfiguration: PropTypes.instanceOf(Promise)
    };
}
