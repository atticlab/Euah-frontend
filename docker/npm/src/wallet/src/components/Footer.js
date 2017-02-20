module.exports = {
    controller: function() {
        var ctrl = this;
    },

    view: function(ctrl) {
        return <footer class="footer text-right">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12">
                        © 2016 - {new Date().getFullYear()} AtticLab
                    </div>
                </div>
            </div>
        </footer>
    }
};