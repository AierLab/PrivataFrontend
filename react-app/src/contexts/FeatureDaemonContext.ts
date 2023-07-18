import { FeatureDaemonContextValue } from "context/FeatureDaemon";
import { createContext } from "react";

const FeatureDaemonContext = createContext<FeatureDaemonContextValue>({ });
export default FeatureDaemonContext
