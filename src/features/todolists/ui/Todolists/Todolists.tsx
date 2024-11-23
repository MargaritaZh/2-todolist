import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Unstable_Grid2"
import { Todolist } from "./Todolist/Todolist"
import { useGetTodolistsQuery } from "../../api/todolistsApi"

export const Todolists = () => {

  // const todolists = useAppSelector(selectTodolists)
  // const dispatch = useAppDispatch()
  // useEffect(() => {
  //   dispatch(fetchTodolistsTC())
  // }, [])
/////////////////////////////

  const { data: todolists,isLoading } = useGetTodolistsQuery()

  ///////////////////////////////

  //СДЕЛАТЬ GET ЗАПРОС ПО УСЛОВИЮ (при нажатии на button)
  // const [skip, setSkip] = useState(true)
  //если skip true - ПРОПУСТИТЬ НЕ ДЕЛАТЬ ЗАПРОС

  // const { data: todolists } = useGetTodolistsQuery(undefined, { skip })

  // const fetchTodolistHandler = () => {
  //   setSkip(false)
  // }
//////////////////

  // const [trigger, { data: todolists }] = useLazyGetTodolistsQuery()
  // const fetchTodolistHandler = () => {
  //   trigger()
  // }
/////////////////////////

  return (
    <>
      {/*<div>*/}
      {/*  <button onClick={fetchTodolistHandler}>Загрузить тудулисты</button>*/}
      {/*</div>*/}


      {todolists?.map((tl) => {
        return (
          <Grid key={tl.id}>
            <Paper sx={{ p: "0 20px 20px 20px" }}>
              <Todolist key={tl.id} todolist={tl} />
            </Paper>
          </Grid>
        )
      })}
    </>
  )
}
