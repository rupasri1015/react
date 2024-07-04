export function getRepairRequestId(path) {
    const newStr = path.split('/');
    return newStr[newStr.length-1];
}

const sum = (array) => array.reduce((a, b) => { return a + b }, 0);

export function disableAssignButton(assignReqData){
    let totalAssign = 0;
	for (let index = 0; index < assignReqData.length; index++) {
        totalAssign += assignReqData[index].assignedQuantity;
        if(sum(assignReqData[index].orderItemIdAvailability) < assignReqData[index].assignedQuantity){
            return true;
        }
	}
	if(totalAssign === 0) {
		return true;
    }
    return false;
}