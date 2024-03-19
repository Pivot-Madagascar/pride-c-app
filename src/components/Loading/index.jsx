import React from "react";

import { Layer, CircularLoader, Center } from "@dhis2/ui";

import "./style.scss";

const CustomLoading = () => {
  return (
    <>
        <Layer translucent>
            <Center>
                <CircularLoader />
            </Center>
        </Layer>
    </>
  )
}

export default CustomLoading;
