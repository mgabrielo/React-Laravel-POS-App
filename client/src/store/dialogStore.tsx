import { action, makeObservable, observable } from "mobx";
import { IRootStore } from "./rootStore";

export default class DialogStore {
  BASE_URL = process.env.REACT_APP_API_URL + "/auth";
  private rootStore: IRootStore;
  private confirmFn: any = null;
  isDialogOpen = false;
  dialogText = "Are You Sure ?";

  constructor(rootStore: IRootStore) {
    makeObservable(this, {
      isDialogOpen: observable,
      dialogText: observable,
      openDialog: action,
      closeDialog: action,
      confrimAction: action,
    });
    this.rootStore = rootStore;
  }

  openDialog(data: any) {
    if (data) {
      this.confirmFn = data.confirmFn;
      this.dialogText = data.dialogText;
      this.isDialogOpen = true;
    }
  }
  closeDialog() {
    this.confirmFn = null;
    this.dialogText = "Are you sure ?";
    this.isDialogOpen = false;
  }
  confrimAction = () => {
    if (this.confirmFn) this.confirmFn();
    this.closeDialog();
  };
}
