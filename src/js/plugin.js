var COLUMN_WIDTH = 16,
    BORDER_WIDTH = 1,
    MediumEditorTable;

MediumEditorTable = MediumEditor.extensions.form.extend({
    name: 'table',

    aria: 'create table',
    action: 'table',
    contentDefault: 'TBL',
    contentFA: '<i class="fa fa-table"></i>',

    handleClick: function (event) {
        event.preventDefault();
        event.stopPropagation();

        var self = this;
        this[this.isActive() === true ? 'hide' : 'show'](this);
        if (this.isActive()) {
            $('body').on('click', function () {
                self.hide(self);
            });
        } else {
            $('body').off('click', function () {
                self.hide(self);
            });
        }
    },

    hide: function (target) {
        var self = target ? target : this
        this.setInactive();
        this.builder.hide();
    },

    show: function () {
        this.setActive();

        var range = MediumEditor.selection.getSelectionRange(this.document);
        if (range.startContainer.nodeName.toLowerCase() === 'td' ||
          range.endContainer.nodeName.toLowerCase() === 'td' ||
          MediumEditor.util.getClosestTag(MediumEditor.selection.getSelectedParentElement(range), 'td')) {
            this.builder.setEditor(MediumEditor.selection.getSelectedParentElement(range), this.restrictNestedTable);
        } else {
            this.builder.setBuilder();
        }
        this.builder.show(this.button.offsetLeft);
    },

    getForm: function () {
        if (!this.builder) {
            this.builder = new Builder({
                onClick: function (rows, columns) {
                    if (rows > 0 || columns > 0) {
                        this.table.insert(rows, columns);
                    }
                    this.hide();
                }.bind(this),
                ownerDocument: this.document,
                rows: this.rows || 10,
                columns: this.columns || 10
            });

            this.table = new Table(this.base);
        }

        return this.builder.getElement();
    }
});
