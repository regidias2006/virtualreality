// Registering component in foo-component.js
AFRAME.registerComponent('foo', {
    schema: {},
    init: function () {
        this.el.addEventListener('click', () => {
            alert('Clicked!')
        });
        alert("iniciou");
        showUsers(1);
    },
    update: function () {},
    tick: function () {},
    remove: function () {},
    pause: function () {},
    play: function () {}
  });

  AFRAME.registerComponent('bar', {
    schema: {
      color: {default: '#FFF'},
      size: {type: 'int', default: 5}
    }
  });

  AFRAME.registerComponent('clickhandler', {
    init: function() {
        this.el.addEventListener('click', () => {
            alert('Clicked!')
        });
}});