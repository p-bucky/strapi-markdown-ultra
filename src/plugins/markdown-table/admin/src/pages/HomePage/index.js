// @ts-nocheck
/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from "react";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";
import {
  Box,
  Button,
  ContentLayout,
  HeaderLayout,
  Layout,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Textarea,
  IconButton,
  Flex,
  Initials,
  Typography,
} from "@strapi/design-system";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Plus,
  Text,
  Trash,
} from "@strapi/icons";

const DEFAULT_TABLE_CONTENT_ITEM_CELL = {
  id: 1,
  value: "",
};

const DEFAULT_TABLE_CONTENT_ITEM = {
  id: 1,
  cells: [DEFAULT_TABLE_CONTENT_ITEM_CELL],
};

const DEFAULT_TABLE_CONTENT = [DEFAULT_TABLE_CONTENT_ITEM];

function convertJSONToMarkdownTable(jsonData) {
  let markdownTable = "| ";

  // Extract header row
  const headerRow = jsonData[0].cells.map((cell) => cell.value);

  // Generate header row in markdown format
  markdownTable += headerRow.join(" | ") + " |\n";

  // Generate horizontal line
  markdownTable += "|";
  for (let i = 0; i < headerRow.length; i++) {
    markdownTable += " ---- |";
  }
  markdownTable += "\n";

  // Generate data rows
  for (let i = 1; i < jsonData.length; i++) {
    const rowCells = jsonData[i].cells.map((cell) => cell.value);
    markdownTable += "| " + rowCells.join(" | ") + " |\n";
  }

  return markdownTable;
}

function convertMarkdownToJSON(markdownTable) {
  const lines = markdownTable.split("\n");

  // Extract header row
  const headerRow = lines[1]
    .trim()
    .split("|")
    .map((cell) => cell.trim());

  const jsonData = [];

  // Iterate over data rows
  for (let i = 2; i < lines.length; i++) {
    const rowCells = lines[i]
      .trim()
      .split("|")
      .map((cell) => cell.trim());

    // Skip empty lines and horizontal line
    if (rowCells.length === 0 || rowCells[0].startsWith("-")) {
      continue;
    }

    const student = { id: parseInt(rowCells[1]), cells: [] };

    // Iterate over cells and create cell objects
    for (let j = 2; j < rowCells.length; j++) {
      student.cells.push({
        id: j - 1,
        value: rowCells[j],
      });
    }

    jsonData.push(student);
  }

  return jsonData;
}

const HomePage = () => {
  const [tableContent, setTableContent] = useState(DEFAULT_TABLE_CONTENT);

  useEffect(() => {
    // console.log(tableContent);
  }, [tableContent]);

  const updateIndexes = (tableItems) => {
    const _tableItems = tableItems.map((row, rowIndex) => {
      const updatedIndexCells = row.cells.map((cell, cellIndex) => {
        return {
          ...cell,
          id: cellIndex + 1,
        };
      });
      return {
        ...row,
        id: rowIndex + 1,
        cells: updatedIndexCells,
      };
    });
    return _tableItems;
  };

  const insertRow = ({ nextRowIndex }) => {
    let _tableContent = JSON.parse(JSON.stringify(tableContent));
    let _DEFAULT_TABLE_CONTENT_ITEM = DEFAULT_TABLE_CONTENT_ITEM;

    _DEFAULT_TABLE_CONTENT_ITEM.cells = new Array(
      tableContent[0].cells.length
    ).fill(DEFAULT_TABLE_CONTENT_ITEM_CELL);

    _tableContent = [
      ..._tableContent.slice(0, nextRowIndex),
      _DEFAULT_TABLE_CONTENT_ITEM,
      ..._tableContent.slice(nextRowIndex, _tableContent.length),
    ];
    setTableContent(updateIndexes(_tableContent));
  };

  const removeRow = ({ rowId }) => {
    let _tableContent = JSON.parse(JSON.stringify(tableContent));
    _tableContent = _tableContent.filter((row) => row.id !== rowId);
    setTableContent(updateIndexes(_tableContent));
  };

  const insertCellInEveryRow = ({ nextCellIndex }) => {
    let _tableContent = JSON.parse(JSON.stringify(tableContent));

    _tableContent.map((row) => {
      const _cells = [
        ...row.cells.slice(0, nextCellIndex),
        DEFAULT_TABLE_CONTENT_ITEM_CELL,
        ...row.cells.slice(nextCellIndex - 1, row.cells.length - 1),
      ];

      row.cells = _cells;
    });
    setTableContent(updateIndexes(_tableContent));
  };

  const removeCellInEveryRow = ({ cellId }) => {
    let _tableContent = JSON.parse(JSON.stringify(tableContent));

    _tableContent.map((row) => {
      row.cells = row.cells.filter((cell) => cell.id !== cellId);
    });
    setTableContent(updateIndexes(_tableContent));
  };

  const onChangeCellValue = ({ rowIndex, cellIndex, value }) => {
    let _tableContent = JSON.parse(JSON.stringify(tableContent));
    _tableContent[rowIndex].cells[cellIndex].value = value;
    setTableContent(_tableContent);
  };

  const moveColumn = ({ type, cellIndex }) => {
    let nextIndex = null;

    if (type == "LEFT") {
      nextIndex = cellIndex - 1;
    }
    if (type == "RIGHT") {
      nextIndex = cellIndex + 1;
    }

    let _tableContent = JSON.parse(JSON.stringify(tableContent));

    _tableContent.map((row) => {
      const tempCell = row.cells[cellIndex];
      row.cells[cellIndex] = row.cells[nextIndex];
      row.cells[nextIndex] = tempCell;
    });

    setTableContent(updateIndexes(_tableContent));
  };

  const moveRow = ({ type, rowIndex }) => {
    let nextIndex = null;

    if (type == "UP") {
      nextIndex = rowIndex - 1;
    }
    if (type == "DOWN") {
      nextIndex = rowIndex + 1;
    }

    let _tableContent = JSON.parse(JSON.stringify(tableContent));
    const tempCell = _tableContent[rowIndex];
    _tableContent[rowIndex] = _tableContent[nextIndex];
    _tableContent[nextIndex] = tempCell;

    setTableContent(updateIndexes(_tableContent));
  };

  return (
    <Box>
      <Layout>
        <HeaderLayout title="Markdown Table" as="h2" />
        <ContentLayout>
          <Box paddingBottom={2}>
            <Flex justifyContent={"end"}>
              <Box paddingRight={2}>
                <Button
                  onClick={() => {
                    console.log(convertJSONToMarkdownTable(tableContent));
                  }}
                >
                  Convert
                </Button>
              </Box>
              <Button
                onClick={() => {
                  console.log(convertJSONToMarkdownTable(tableContent));
                }}
              >
                Insert
              </Button>
            </Flex>
          </Box>
          <Table>
            <Thead></Thead>
            <Tbody>
              {(tableContent || []).map((row, rowIndex) => {
                return (
                  <Tr key={row.id}>
                    <Td>
                      <Typography variant="sigma">{row.id}</Typography>
                    </Td>
                    {row.cells.map((cell, cellIndex) => {
                      return (
                        <Td key={`${cell.id}-${row.id}`}>
                          {row.id == 1 && (
                            <Box paddingBottom={2}>
                              <Flex justifyContent={"end"}>
                                <Box paddingRight={1}>
                                  <IconButton
                                    disabled={row.cells.length == 1}
                                    onClick={() => {
                                      removeCellInEveryRow({
                                        cellId: cell.id,
                                      });
                                    }}
                                    label="Remove Column"
                                    icon={<Trash />}
                                  />
                                </Box>
                                <Box paddingRight={1}>
                                  <IconButton
                                    onClick={() => {
                                      insertCellInEveryRow({
                                        nextCellIndex: cellIndex + 1,
                                      });
                                    }}
                                    label="Add Column"
                                    icon={<Plus />}
                                  />
                                </Box>

                                <Box paddingRight={1}>
                                  <IconButton
                                    disabled={cellIndex == 0}
                                    onClick={() => {
                                      moveColumn({
                                        type: "LEFT",
                                        cellIndex,
                                      });
                                    }}
                                    label="Move Left"
                                    icon={<ChevronLeft />}
                                  />
                                </Box>

                                <IconButton
                                  disabled={cellIndex == row.cells.length - 1}
                                  onClick={() => {
                                    moveColumn({
                                      type: "RIGHT",
                                      cellIndex,
                                    });
                                  }}
                                  label="Move Right"
                                  icon={<ChevronRight />}
                                />
                              </Flex>
                            </Box>
                          )}
                          <Textarea
                            onChange={(event) => {
                              onChangeCellValue({
                                rowIndex,
                                cellIndex,
                                value: event.target.value,
                              });
                            }}
                          >
                            {cell.value}
                          </Textarea>
                        </Td>
                      );
                    })}

                    <Td>
                      <Flex>
                        <IconButton
                          onClick={() => {
                            insertRow({ nextRowIndex: rowIndex + 1 });
                          }}
                          label="Add Row"
                          icon={<Plus />}
                        />
                        <Box paddingLeft={1}>
                          <IconButton
                            disabled={tableContent.length == 1}
                            onClick={() => {
                              removeRow({ rowId: row.id });
                            }}
                            label="Remove Row"
                            icon={<Trash />}
                          />
                        </Box>
                      </Flex>
                      <Box marginTop={1}>
                        <Flex>
                          <Box paddingRight={1}>
                            <IconButton
                              disabled={rowIndex == 0}
                              onClick={() => {
                                moveRow({
                                  type: "UP",
                                  rowIndex,
                                });
                              }}
                              label="Move Up"
                              icon={<ChevronUp />}
                            />
                          </Box>

                          <IconButton
                            disabled={rowIndex == tableContent.length - 1}
                            onClick={() => {
                              moveRow({
                                type: "DOWN",
                                rowIndex,
                              });
                            }}
                            label="Move Down"
                            icon={<ChevronDown />}
                          />
                        </Flex>
                      </Box>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </ContentLayout>
      </Layout>
    </Box>
  );
};

export default HomePage;
