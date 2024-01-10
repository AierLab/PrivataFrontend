import { MotionValue, SpringOptions, useSpring, useTransform } from "framer-motion";

declare type SingleTransformer<I, O> = (input: I) => O;

export function useSmoothTransform<T, R>(value: MotionValue<T>, springOptions: SpringOptions | undefined, transformer: SingleTransformer<T, R>) {
  return useSpring(useTransform(value, transformer), springOptions);
}
