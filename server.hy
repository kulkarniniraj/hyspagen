(import [pony.orm [*]]
        [db_model [User]]
        [flask [Flask request render_template]])

(setv app (Flask __name__))

(defn dissoc-dict [dct key]
  (setv _t (.copy dct))
  (setv _r1 (.pop _t key))
  [_r1 _t])

#@((app.route "/")
    (defn index [] (render_template "index.html")))

#@(db_session (defn create [&kwargs kwargs]
                (User #** kwargs)))

#@((app.route "/create" :methods ["POST"])
          (defn create_api []
            (try
              (create #** (. request json))
              {"error" 0}
              (except [e Exception]
                (, {"error" 1 "desc" (str e)} 400)))))

(, 1 2 3)
#@(db_session (defn getall []
                (list (select (gfor u User u)))))

#@((app.route "/getall" )
    (defn getall_api []
      (try
        {"error" 0 "data" (lfor u (getall) (.to_dict u))}
        (except [e Exception]
          {"error" 1 "desc" (str e)}))))

#@(db_session (defn getone [id]
                (. User [id])))

#@((app.route "/get/<id>" )
    (defn get_api [id]
      (try
        {"error" 0 "data" (.to_dict (getone id))}
        (except [e Exception]
          {"error" 1 "desc" (str e)}))))

#@(db_session (defn update [id &kwargs kwargs]
                (.set (. User [id]) #** kwargs)))

#@((app.route "/update" :methods ["POST"])
    (defn update_api []
      (try
        (setv [id rest] (dissoc-dict (. request json) "id"))
        (update id #** rest)
        {"error" 0}
        (except [e Exception]
          {"error" 1 "desc" (str e)}))))

#@(db_session (defn delete [id]
                (.delete (. User [id]) )))

#@((app.route "/delete" :methods ["POST"])
    (defn delete_api []
      (try
        (delete (. request json ["id"]))
        {"error" 0}
        (except [e Exception]
          {"error" 1 "desc" (str e)}))))

(.run app :debug True)

