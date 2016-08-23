angular.module("torrentApp").directive('actionHeader', ['$compile', 'torrentMiddlewareService', 'electron', function($compile, bittorrent, electron) {

    var actionHeader = null;
    var toggleAble = [];

    return {
        restrict: 'A',
        scope: {
            actions: '=',
            click: '=',
            labels: '=',
            bind: '=?',
            click: '=?',
            enabled: '=?'
        },
        compile: compile
    };

    function compile(element) {
        actionHeader = element;
        element.addClass('action header');
        return link;
    }

    function render(scope, element, attr){
        toggleAble = [];

        scope.actions.forEach(function(item){
            if (item.type === 'button') {
                appendButton(element, item, scope);
            } else if (item.type === 'labels') {
                appendLabelsDropdown(element, item, scope);
            } else if (item.type === 'dropdown') {
                appendDropdown(element, item, scope);
            }
        });

        scope.$watch(function() {
            return scope.enabled;
        }, function(disable) {
            toggleActive(disable)
        });
    }

    function toggleActive(disable) {
        toggleAble.forEach(function(element) {
            if (disable) {
                element.addClass('disabled')
            } else {
                element.removeClass('disabled')
            }
        })
    }

    function appendDropdown(list, item, scope) {
        var dropdown = angular.element('<div dropdown class="ui top left pointing labeled icon dropdown button"></div>');
        dropdown.addClass(item.color);
        addIcon(dropdown, 'plus');

        var text = angular.element('<span class="text"></span>');
        text.append(item.label);
        dropdown.append(text);

        var menu = angular.element('<div class="menu"></div>');

        item.actions.forEach(function(action){
            var option = angular.element('<div class="item"></div>');
            option.append(action.label);

            option.bind('click', function() {
                scope.click(action.click, action.label)
            })

            menu.append(option);
        });

        dropdown.append(menu);

        $compile(dropdown)(scope);
        list.append(dropdown);
    }

    function appendButton(list, item, scope){
        var button = angular.element('<a class="ui labeled icon button"></a>');
        button.addClass(item.color);

        addIcon(button, item.icon)

        button.append(item.label);

        button.bind('click', function() {
            scope.click(item.click, item.label);
        })

        if (!item.alwaysActive) {
            toggleAble.push(button);
        }

        list.append(button);
    }

    function appendLabelsDropdown(list, item, scope){
        var dropdown = angular.element('<span labels-dropdown labels="labels" action="addLabel" enabled="enabled"></span>');

        scope.addLabel = function(label) {
            scope.click(item.click, item.label + ' ' + label, label)
        }

        $compile(dropdown)(scope);
        list.append(dropdown);
    }

    function addIcon(item, iconName) {
        var icon = angular.element('<i></i>')
        icon.addClass('ui ' + iconName + ' icon');
        item.append(icon);
    }

    function link(scope, element, attr){
        scope.program = electron.program;

        render(scope, element, attr);

        // Bind show function to scope variable
        scope.bind = {

        };

    }

}]);
