var COLUMN_WIDTH = 16,
    BORDER_WIDTH = 1,
    MediumEditorTable;

MediumEditorTable = MediumEditor.extensions.form.extend({
    name: 'table',

    aria: 'create table',
    action: 'table',
    contentDefault: '<i class="icon-table"></i>',
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
        var self = target ? target : this;
        this.setInactive();
        this.builder.hide();
    },

    show: function () {
        this.setActive();

        var range = MediumEditor.selection.getSelectionRange(this.document),
            isEditorSelection;
        if (range) {
            isEditorSelection = this.isNodeEditor(range.commonAncestorContainer, this.document.querySelector('.medium-editor-element'));
        }
        if (!range || !isEditorSelection) {
            var mainNode = this.document.querySelector('.medium-editor-element'),
                newRange = document.createRange();
            newRange.setStart(mainNode, 0);
            newRange.setEnd(mainNode, 0);
            var sel = this.document.getSelection();
            sel.removeAllRanges();
            sel.addRange(newRange);
            range = MediumEditor.selection.getSelectionRange(this.document);
        }
        if (range.startContainer.nodeName.toLowerCase() === 'td' ||
          range.endContainer.nodeName.toLowerCase() === 'td' ||
          range.startContainer.nodeName.toLowerCase() === 'tr' ||
          range.endContainer.nodeName.toLowerCase() === 'tr' ||
          MediumEditor.util.getClosestTag(MediumEditor.selection.getSelectedParentElement(range), 'td')) {
            this.builder.setEditor(MediumEditor.selection.getSelectedParentElement(range), this.restrictNestedTable);
        } else {
            this.builder.setBuilder();
        }
        this.builder.show(this.button.offsetLeft);
    },

    isNodeEditor: function (node, editor) {
        while (node) {
            if (node === editor) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
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
                columns: this.columns || 10,
                base: this.base
            });

            this.table = new Table(this.base);
        }

        return this.builder.getElement();
    }
});
