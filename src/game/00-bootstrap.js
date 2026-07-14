class Component extends DCLogic {
  renderVals(){ return {}; }
  componentDidMount(){
    const el = id => document.getElementById(id);
    const canvas = el('ns_game'), ctx = canvas.getContext('2d');

