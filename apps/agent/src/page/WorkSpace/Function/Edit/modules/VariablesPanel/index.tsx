import Icon from "@ant-design/icons"
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridColDef,
  GridRowId,
  GridRowsProp,
  useGridApiRef,
} from "@mui/x-data-grid-premium"
import { Button, Input } from "antd"
import { FC } from "react"
import { v4 } from "uuid"
import { DeleteIcon, PlusIcon } from "@illa-public/icon"
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
        type: E_VARIABLE_TYPE.ARRAY,
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
]

for (let i = 6; i <= 10; i++) {
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

const VariablesPanel: FC = () => {
  const rows: GridRowsProp = addPath(data)

  const apiRef = useGridApiRef()

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
        isNew: true,
      },
    ])

    apiRef.current.startRowEditMode({ id: id, fieldToFocus: "name" })
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
      renderEditCell: () => <Input variant="filled" />,
    },
    {
      field: "required",
      headerName: "Required",
      type: "boolean",
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      type: "string",
      width: 240,
      editable: true,
      renderEditCell: () => <Input.TextArea />,
    },
    {
      field: "type",
      headerName: "Type",
      type: "singleSelect",
      editable: true,
      valueOptions: [
        E_VARIABLE_TYPE.STRING,
        E_VARIABLE_TYPE.BOOLEAN,
        E_VARIABLE_TYPE.NUMBER,
        E_VARIABLE_TYPE.OBJECT,
        E_VARIABLE_TYPE.ARRAY,
      ],
    },
    {
      field: "actions",
      headerName: "",
      type: "actions",
      cellClassName: "actions",
      align: "right",
      getActions: ({ id, row }) => {
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
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        getTreeDataPath={getTreeDataPath}
        hideFooter
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { addRows },
        }}
        processRowUpdate={(updatedRow) => {
          if (
            (updatedRow.type === E_VARIABLE_TYPE.ARRAY ||
              updatedRow.type === E_VARIABLE_TYPE.OBJECT) &&
            updatedRow.isNew
          ) {
            addRows(updatedRow.path)
          }
          return {
            ...updatedRow,
            isNew: false,
          }
        }}
      />
    </div>
  )
}

export default VariablesPanel
