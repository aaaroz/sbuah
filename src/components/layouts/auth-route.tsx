import { getSession } from "@/lib/utils/auth-client";
import { useRouter } from "next/router";
import { type PropsWithChildren, useEffect } from "react";

export const AuthRoute = (props: PropsWithChildren) => {
  const router = useRouter();

  useEffect(() => {
    void (async function () {
      const { data } = await getSession();

      if (!data?.user) {
        await router.replace("/");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return props.children;
};
