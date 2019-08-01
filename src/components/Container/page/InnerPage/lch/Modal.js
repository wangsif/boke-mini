/**
 * Created by C3 on 2018/10/17.
 */
import Loading from './ModalBody';

let loadingInstance = 0;
let getLoadingInstance = (tip,multiple,style,styleValue) => {
    style=style?style:{};
    styleValue=styleValue?styleValue:{};
    loadingInstance = loadingInstance || Loading.newInstance({
        tip,multiple,style,styleValue
    });
    return loadingInstance;
};
export default {
    open(tip,multiple,style,styleValue) {
        getLoadingInstance(tip,multiple,style,styleValue);
    },
    close() {
        if (loadingInstance) {
            loadingInstance.destroy();
            loadingInstance = null;
        }
    },
};
