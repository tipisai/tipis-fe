import { FC, Suspense, lazy } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IFunctionInterface, TIntegrationType } from "@illa-public/public-types"
import LayoutBlock from "@/Layout/Form/LayoutBlock"

const getEventEditorByIntegrationType = (integrationType: TIntegrationType) => {
  switch (integrationType) {
    case "tencentcos":
      return lazy(() => import("./panels/tencentCos"))
    case "larkBot":
      return lazy(() => import("./panels/tencentCos"))
  }
}

const EventEditor: FC = () => {
  const { t } = useTranslation()
  const { control } = useFormContext<IFunctionInterface>()
  const integrationType = useWatch({
    control,
    name: "resourceType",
  })
  const EventEditorComponent = getEventEditorByIntegrationType(integrationType)
  return (
    <LayoutBlock
      title={t("function.edit.configure.label.event")}
      description={t("function.edit.configure.tips.event")}
    >
      <Suspense>
        <EventEditorComponent />
      </Suspense>
    </LayoutBlock>
  )
}

export default EventEditor
