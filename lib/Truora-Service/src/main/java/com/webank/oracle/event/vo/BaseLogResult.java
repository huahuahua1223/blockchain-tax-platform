package com.webank.oracle.event.vo;

import org.fisco.bcos.web3j.abi.datatypes.generated.Bytes32;
import org.fisco.bcos.web3j.tx.txdecode.LogResult;

import com.webank.oracle.base.utils.CommonUtils;
import com.webank.oracle.base.utils.JsonUtils;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 *
 */

@Slf4j
@Data
public abstract class BaseLogResult implements LogEvent{

    public static final String LOG_REQUEST_ID = "requestId";
    public static final String CORE_CONTRACT_ADDRESS = "coreAddress";

    protected String requestId;
    protected String coreContractAddress;
    protected Bytes32 requestIdBytes32;

    public BaseLogResult(LogResult logResult){
        requestId = CommonUtils.byte32LogToString(logResult.getLogParams(), LOG_REQUEST_ID);
        requestIdBytes32 = CommonUtils.getBytes32FromEventLog(logResult.getLogParams(), LOG_REQUEST_ID);

        coreContractAddress = CommonUtils.getStringFromEventLog(logResult.getLogParams(), CORE_CONTRACT_ADDRESS);
        parse(logResult);
    }

    @Override
    public String toString() {
        return JsonUtils.toJSONString(this);
    }
}