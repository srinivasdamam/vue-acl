"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Acl = function () {
  function Acl() {
    _classCallCheck(this, Acl);
  }

  _createClass(Acl, [{
    key: 'init',
    value: function init(router, permission, store) {
      this.router = router;
      this._store = store;
      if (sessionStorage.getItem('acl_current') == null) {
        sessionStorage.setItem('acl_current', permission);
        this._store.state.acl_current = permission;
      } else {
        this._store.state.acl_current = sessionStorage.getItem('acl_current');
      }
    }
  }, {
    key: 'check',
    value: function check(permission) {
      if (Array.isArray(permission)) return permission.indexOf(this._store.state.acl_current) !== -1 ? true : false;else return this._store.state.acl_current == permission;
    }
  }, {
    key: 'active',
    set: function set(active) {
      sessionStorage.setItem('acl_current', active || null);
      this._store.state.acl_current = sessionStorage.getItem('acl_current');
    },
    get: function get() {
      return this._store.state.acl_current;
    }
  }, {
    key: 'router',
    set: function set(router) {
      var _this = this;

      router.beforeEach(function (to, from, next) {
        if (typeof to.meta.permission == 'undefined') return false;else {
          var permission = to.meta.permission.indexOf('.') !== -1 ? to.meta.permission.split('.') : to.meta.permission;
          if (!_this.check(permission)) return false;
          next();
        }
      });
    }
  }]);

  return Acl;
}();

var acl = new Acl();

Acl.install = function (Vue, _ref) {
  var router = _ref.router,
      d_permission = _ref.d_permission,
      store = _ref.store;

  acl.init(router, d_permission, store);

  Vue.prototype.can = function (permission) {
    if (typeof permission != 'undefined') permission = permission.indexOf('.') !== -1 ? permission.split('.') : permission;
    return acl.check(permission);
  };

  Vue.prototype.changeAccess = function (newAccess) {
    acl.active = newAccess;
  };
};

export default Acl;