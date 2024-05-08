import { FC, Suspense, lazy } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { TIntegrationType } from "@illa-public/public-types"
import LayoutBlock from "@/Layout/Form/LayoutBlock"
import { IFunctionForm } from "../../interface"

const tencentCos = lazy(() => import("./panels/tencentCos"))

const getEventEditorByIntegrationType = (integrationType: TIntegrationType) => {
  switch (integrationType) {
    case "tencentcos":
      return tencentCos
    case "larkim":
      return null
  }
}

const EventEditor: FC = () => {
  const { t } = useTranslation()
  const { control } = useFormContext<IFunctionForm>()
  const integrationType = useWatch({
    control,
    name: "resourceType",
  })
  const EventEditorComponent = getEventEditorByIntegrationType(integrationType)
  return EventEditorComponent ? (
    <LayoutBlock
      title={t("function.edit.configure.label.event")}
      description={t("function.edit.configure.tips.event")}
    >
      <Suspense>
        <EventEditorComponent />
      </Suspense>
    </LayoutBlock>
  ) : null
}

export default EventEditor
