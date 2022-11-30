class C {
  constructor() {
    this.hey = () => {console.log(this);};
  }
  m() {
  }
}
const i = new C();
i.hey();
