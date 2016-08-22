import { select } from 'd3-selection';
import { className } from './utils';

export default class DomainInput {
  constructor(parent, props) {
    this.parent = parent;
    this.update(props);
  }

  update(nextProps) {
    this.props = nextProps;
    this.render();
  }

  createRangeField(callback) {
    const displayLabel = this.root.append('span')
      .attr('class', className('display-field'));

    const rangeField = this.root.append('input')
      .attr('class', className('input-field'))
      .attr('type', 'range')
      .on('change', callback);

    return { displayLabel, rangeField };
  }

  setup() {
    const that = this;
    // create the main panel div
    this.root = select(this.parent)
      .append('div')
        .attr('class', className('domain-input'));

    const startFields = this.createRangeField(
      function change() {
        const value = parseInt(this.value, 10);
        const domain = that.props.domain;
        that.props.onChange([value, domain[1]]);
      });

    const endFields = this.createRangeField(
      function change() {
        const value = parseInt(this.value, 10);
        const domain = that.props.domain;
        that.props.onChange([domain[0], value]);
      });

    this.domainStartLabel = startFields.displayLabel;
    this.domainStartRange = startFields.rangeField;
    this.domainEndLabel = endFields.displayLabel;
    this.domainEndRange = endFields.rangeField;
  }

  render() {
    if (!this.root) {
      this.setup();
    }

    const domain = this.props.domain;

    // determine current max and min - this will ensure our domain will always
    // have the highest max/min possible given the original domain provided.
    const currentMin = parseInt(this.domainStartRange.attr('min'), 10) || Infinity;
    const currentMax = parseInt(this.domainEndRange.attr('max'), 10) || 0;
    const inputBounds = [
      Math.min(currentMin, domain[0]),
      Math.max(currentMax, domain[1]),
    ];

    this.domainStartLabel.text(`Min: ${domain[0]}`);
    this.domainStartRange.property('value', domain[0])
      .attr('min', inputBounds[0])
      .attr('max', inputBounds[1]);
    this.domainEndLabel.text(`Max: ${domain[1]}`);
    this.domainEndRange.property('value', domain[1])
      .attr('min', inputBounds[0])
      .attr('max', inputBounds[1]);
  }
}
