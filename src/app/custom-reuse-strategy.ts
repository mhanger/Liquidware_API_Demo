import { ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle, Route } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {

  private acceptedRoutes: string[] = [":timeFrame/users"];

  storedRoutes: { [key: string]: DetachedRouteHandle } = {};

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // check to see if the route's path is in our acceptedRoutes array
    if (this.acceptedRoutes.indexOf(route.routeConfig.path) > -1) {
        //console.log("detaching", route);
        return true;
    } else {
        return false;
    }
}

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    let key = this.computeSnapshotKey(route);
    //console.log("=====> CRS STORING: key:[" + key + "] HANDLE:[" + (handle ? this.showHandle(handle) : "null") + "], storedRoute:", handle);
    this.storedRoutes[key] = handle;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    let key = this.computeSnapshotKey(route);
        let result: boolean = !!key && !!this.storedRoutes[key];
        return result;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    let key = this.computeSnapshotKey(route);
    let handle = null;
    if (key && this.storedRoutes[key]) {
      handle = this.storedRoutes[key];
    }
    //console.log("=====> CRS RETRIEVE key:[" + key + "] ==> " + (handle ? "found!" : "not found."), route, "return: ", this.storedRoutes[key]);
    return handle;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    let result: boolean = future.routeConfig === curr.routeConfig;
    return result;
  }

  printRouteHierarchy(result: any, s: string): string {
    s += result.value.routeConfig.path + ":";
    s += result.children.length;
    for (var c=0; c < result.children.length; c++) {
      s += ",("
      s = this.printRouteHierarchy(result.children[c], s);
      s += ")";
    }
    return s;
  }

  showHandle(handle: DetachedRouteHandle): string {
    let h: any = handle;
    var s: string = "";
    s = this.printRouteHierarchy(h.route, s);
    return s;
  }

  computeSnapshotKey(route: ActivatedRouteSnapshot): string {
    return this.findDeepKey(route, "key"); // catenated hierarchical keys
    //return this.findDeepestKey(route);  // only the lowest level
    //return this.createKeyFromPathFromRoot(route);  // key from pathFromRoot
    //return route.routeConfig.path;  // just use the path in routeConfig
  }

  // Finds the unique childmost key
  findDeepestKey(route: ActivatedRouteSnapshot): string {
    let key = "";
    if (route.data && route.data.key && route.component) {
      key = route.data.key;
    }
    if (route.firstChild) {
      return this.findDeepestKey(route.firstChild);
    }
    return key;
  }

  // Finds the unique keys associated with components and builds a composite key
  // of the catenated hierarchical keys
  findDeepKey(route: ActivatedRouteSnapshot, key: string): string {
    let newKey = key;
    if (route.data && route.data.key && route.component) {
      newKey += "-" + route.data.key;
    }
    if (route.firstChild) {
      return this.findDeepKey(route.firstChild, newKey);
    }
    return newKey;
  }

  private createKeyFromPathFromRoot(route: ActivatedRouteSnapshot) {
    const pathFromRoot: ActivatedRouteSnapshot[]  = route.pathFromRoot;
    let url: string = '';

    for (let path of pathFromRoot) {
      if(path.url && `${path.url}`) {
        url = `${url}/${path.url.join('/')}`;
      }
    }
    return url;
  }
}
