function UI(container) {
  this.container = container;
}

UI.create = function (container) {
  return new UI(container);
};
