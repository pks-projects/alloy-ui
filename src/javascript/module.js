AUI().add(
	'module',
	function(A) {
		var Lang = A.Lang,

			getClassName = A.ClassNameManager.getClassName,

			NAME = 'module',

			CSS_MODULE = getClassName(NAME),

			CSS_MODULES = {
				body: 'bd',
				footer: 'ft',
				header: 'hd'
			},

			CSS_COLLAPSED = getClassName(NAME, 'collapsed'),
			CSS_ICON_COLLAPSE = 'minus',
			CSS_ICON_EXPAND = 'plus',
			CSS_CLEARFIX = getClassName('helper', 'clearfix'),
			CSS_HEADER_TEXT = getClassName(NAME, 'hd', 'text'),

			TPL_HEADER_TEXT = '<span class="' + CSS_HEADER_TEXT + '"></span>';

		var Module = function() {};

		Module.ATTRS = {
			collapsed: {
				value: false,
				setter: function(value) {
					var instance = this;

					instance._uiSetCollapsed(value);
				}
			},

			collapsible: {
				value: false
			},

			tools: {
				value: []
			}
		};

		Module.prototype = {
			initializer: function(config) {
				var instance = this;

				if (!config.bodyContent) {
					instance.set('bodyContent', ' ');
				}

				if (!config.headerContent) {
					instance.set('headerContent', ' ');
				}

				instance.after('render', instance._afterModuleRender);
				instance.after('collapsedChange', instance._afterCollapsedChange);
			},

			toggle: function() {
				var instance = this;

				instance._toggleProperty('visible');
			},

			toggleCollapse: function() {
				var instance = this;

				instance._toggleProperty('collapsed');
			},

			_afterCollapsedChange: function(event) {
				var instance = this;

				instance._uiSetCollapsed(event.newVal);
			},

			_afterModuleRender: function() {
				var instance = this;

				instance._addModuleClass('body');
				instance._addModuleClass('footer');
				instance._addModuleClass('header');

				instance._renderHeaderText();

				instance._renderToolItems();
			},

			_addModuleClass: function(section) {
				var instance = this;

				var sectionNode = instance[section + 'Node'];

				if (sectionNode) {
					var rootCssClass = CSS_MODULES[section];

					var cssClassMod = getClassName(NAME, rootCssClass);
					var cssClass = getClassName(instance.name, rootCssClass);

					sectionNode.addClass(cssClassMod);
					sectionNode.addClass(cssClass);
				}
			},

			_renderToolItems: function() {
				var instance = this;

				var tools = instance.get('tools');

				if (instance.get('collapsible')) {
					var collapsedIcon = CSS_ICON_COLLAPSE;

					if (instance.get('collapsed')) {
						collapsedIcon = CSS_ICON_EXPAND;
					}

					tools.unshift(
						{
							icon: collapsedIcon,
							id: 'collapse',
							handler: {
								fn: instance.toggleCollapse,
								context: instance
							}
						}
					);
				}

				instance.toolset = new A.ToolSet(
					{
						tools: tools
					}
				).render(instance.headerNode);

				var toolsetClassNameMod = getClassName(NAME, 'toolset');

				instance.toolset.get('boundingBox').addClass(toolsetClassNameMod);

				instance.headerNode.addClass(CSS_CLEARFIX);
			},

			_renderHeaderText: function() {
				var instance = this;

				var headerNode = instance.headerNode;

				var html = headerNode.get('innerHTML');

				headerTextNode = A.Node.create(TPL_HEADER_TEXT);

				headerTextNode.set('innerHTML', html);
				headerNode.set('innerHTML', '');

				headerTextNode.addClass(getClassName(NAME, 'header', 'text'));

				headerNode.prepend(headerTextNode);

				instance.headerTextNode = headerTextNode;
			},

			_toggleProperty: function(key) {
				var instance = this;

				var property = instance.get(key);

				instance.set(key, !property);
			},

			_uiSetCollapsed: function(newVal) {
				var instance = this;

				var action = 'show';
				var cssAction = 'removeClass';

				if (instance.toolset) {
					var collapsedIcon = CSS_ICON_COLLAPSE;

					if (newVal) {
						collapsedIcon = CSS_ICON_EXPAND;
					}

					instance.toolset.tools.item('collapse').set('icon', collapsedIcon);
				}

				if (newVal) {
					action = 'hide';
					cssAction  = 'addClass';
				}

				instance.get('boundingBox')[cssAction](CSS_COLLAPSED);

				instance.bodyNode[action]();
			}
		}

		A.Module = A.Base.build('module', A.Widget, [A.WidgetStdMod, Module]);
	},
	'@VERSION',
	{
		requires: ['widget', 'widget-stdmod', 'tool-set'],
		use: []
	}
);