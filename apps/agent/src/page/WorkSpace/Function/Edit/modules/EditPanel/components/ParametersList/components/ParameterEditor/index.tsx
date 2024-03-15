import Icon from "@ant-design/icons"
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  useGridApiRef,
} from "@mui/x-data-grid-premium"
import { Button } from "antd"
import { FC, useState } from "react"
import { v4 } from "uuid"
import { DeleteIcon, ErrorIcon, PlusIcon, SuccessIcon } from "@illa-public/icon"
import { E_VARIABLE_TYPE, IResourceVariable } from "@illa-public/public-types"
import EditToolbar from "./components/EditToolbar"
import CustomGroupingCell from "./components/GroupCell"
import { addPath } from "./utils"

const data: IResourceVariable[] = [
  {
    id: "1",
    name: "username",
    required: true,
    description: "The username of the user",
    type: E_VARIABLE_TYPE.STRING,
  },
  {
    id: "2",
    name: "age",
    required: true,
    description: "The age of the user",
    type: E_VARIABLE_TYPE.NUMBER,
  },
  {
    id: "3",
    name: "emails",
    required: true,
    description: "An array of email addresses",
    type: E_VARIABLE_TYPE.ARRAY,
    item: [
      {
        id: "3.1",
        name: "email",
        required: true,
        description: "An email address",
        type: E_VARIABLE_TYPE.STRING,
        item: [
          {
            id: "3.1.1",
            name: "email",
            required: true,
            description: "An email address",
            type: E_VARIABLE_TYPE.STRING,
          },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "address",
    required: true,
    description: "The user's address",
    type: E_VARIABLE_TYPE.OBJECT,
    item: [
      {
        id: "4.1",
        name: "street",
        required: true,
        description: "The street address",
        type: E_VARIABLE_TYPE.STRING,
      },
      {
        id: "4.2",
        name: "city",
        required: true,
        description: "The city",
        type: E_VARIABLE_TYPE.STRING,
      },
      {
        id: "4.3",
        name: "country",
        required: true,
        description: "The country",
        type: E_VARIABLE_TYPE.STRING,
      },
    ],
  },
  {
    id: "5",
    name: "isActive",
    required: true,
    description: "Indicates whether the user is active or not",
    type: E_VARIABLE_TYPE.BOOLEAN,
  },
  // Add more data here as needed
]

// Generate 35 more data items...
for (let i = 6; i <= 40; i++) {
  data.push({
    id: i.toString(),
    name: `variable_${i}`,
    required: i % 2 === 0,
    description: `Description for variable_${i}`,
    type: Object.values(E_VARIABLE_TYPE)[
      i % Object.values(E_VARIABLE_TYPE).length
    ],
  })
}

const ParameterEditor: FC = () => {
  const rows: GridRowsProp = addPath(data)

  const apiRef = useGridApiRef()
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const handleSaveClick = (id: GridRowId) => () => {
    apiRef.current.stopRowEditMode({ id })
  }

  const handleCancelClick = (id: GridRowId) => () => {
    apiRef.current.stopRowEditMode({ id, ignoreModifications: true })

    const editedRow = rows.find((row) => row.id === id)
    if (editedRow!.isNew) {
      apiRef.current.updateRows([
        {
          id,
          _action: "delete",
        },
      ])
    }
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    apiRef.current.updateRows([
      {
        id: id,
        _action: "delete",
      },
    ])
  }

  const getTreeDataPath: DataGridPremiumProps["getTreeDataPath"] = (row) =>
    row.path

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const addRows = (parentName: string[] = []) => {
    const id = v4()

    apiRef.current.updateRows([
      {
        id: id,
        name: "",
        required: false,
        description: "",
        type: E_VARIABLE_TYPE.STRING,
        path: [...parentName, id],
      },
    ])

    apiRef.current.startRowEditMode({ id: id, fieldToFocus: "name" })
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }))
    parentName.forEach((name) => {
      apiRef.current.setRowChildrenExpansion(name, true)
    })
  }

  const handleClickAdd = (parentPaths: string[]) => () => {
    addRows(parentPaths)
  }
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Variable name",
      width: 200,
      type: "string",
      editable: true,
    },
    {
      field: "required",
      headerName: "Required",
      type: "boolean",
      width: 150,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      type: "string",
      width: 150,
      editable: true,
    },
    {
      field: "type",
      headerName: "Type",
      type: "singleSelect",
      editable: true,
      valueOptions: ["Market", "Finance", "Development"],
    },
    {
      field: "actions",
      headerName: "",
      type: "actions",
      cellClassName: "actions",
      align: "right",
      getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode)
          return [
            <Button
              key={`${id}-save`}
              icon={<Icon component={SuccessIcon} />}
              type="text"
              onClick={handleSaveClick(id)}
            />,

            <Button
              key={`${id}-cancel`}
              icon={<Icon component={ErrorIcon} />}
              type="text"
              onClick={handleCancelClick(id)}
            />,
          ]
        const commonButton = [
          <Button
            key={`${id}-delete`}
            icon={<Icon component={DeleteIcon} />}
            type="text"
            onClick={handleDeleteClick(id)}
          />,
        ]
        if (
          row.type === E_VARIABLE_TYPE.ARRAY ||
          row.type === E_VARIABLE_TYPE.OBJECT
        ) {
          commonButton.unshift(
            <Button
              key={`${id}-add`}
              icon={<Icon component={PlusIcon} />}
              type="text"
              onClick={handleClickAdd(row.path)}
            />,
          )
        }

        return commonButton
      },
    },
  ]

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGridPremium
        treeData
        editMode="row"
        groupingColDef={{
          headerName: "Group",
          width: 60,
          renderCell: (params) => <CustomGroupingCell {...params} />,
        }}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        getTreeDataPath={getTreeDataPath}
        hideFooter
        onRowEditStop={handleRowEditStop}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { addRows },
        }}
        initialState={{
          pinnedColumns: {
            left: ["__tree_data_group__"],
            right: ["actions"],
          },
        }}
      />
    </div>
  )
}

export default ParameterEditor
