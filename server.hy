(import [pony.orm [*]]
        [db_model [models]]
        [flask [Flask request render_template]])

(setv app (Flask __name__))
; (setv models {"user" User "mobile" Mobile "car" Car})

(defn dissoc-dict [dct key]
  "Separates dict into keyval and rest of dict"
  (setv _t (.copy dct))
  (setv _r1 (.pop _t key))
  [_r1 _t])

(defmacro! idx-route [prefix] 
  `#@((app.route (+ "/" ~prefix "/"))
       (defn ~g!index [] (render_template "index.html"
                                          :cols (. (. models [~prefix]) _columns_without_pk_)
                                          :name ~prefix))))

(defmacro! getcols-route [prefix]
  `#@((app.route (+ "/" ~prefix "/getcols"))
       (defn ~g!getcols [] {"data" (. (. models [~prefix]) _columns_without_pk_)} )))

(defmacro! create-route [prefix]
  `#@(db_session (defn ~g!create [&kwargs kwargs]
                  ((. models [~prefix]) #** kwargs)))

  `#@((app.route ~(+ "/" prefix "/create") :methods ["POST"])
      (defn ~g!create_api []
        (try
          (~g!create #** (. request json))
          {"error" 0}
          (except [e Exception]
            (, {"error" 1 "desc" (str e)} 400))))))

(defmacro! getall-route [prefix]
  `#@(db_session (defn ~g!getall []
                  ;  (lfor record (select (gfor u (. models [~prefix]) u))
                  ;        (.to_dict record :related_objects True))))
                  (list (select (gfor u (. models [~prefix]) u)))))

  `#@((app.route (+ "/" ~prefix "/getall"))
      (defn ~g!getall_api []
        (try
          ; {"error" 0 "data" (~g!getall)}
          {"error" 0 "data" (lfor u (~g!getall) (.to_dict u))}
          (except [e Exception]
            {"error" 1 "desc" (str e)})))))

(defmacro! getone-route [prefix]
  `#@(db_session (defn ~g!getone [id]
                  (. (. models [~prefix]) [id])))

  `#@((app.route (+ "/" ~prefix "/get/<id>") )
      (defn ~g!get_api [id]
        (try
          {"error" 0 "data" (.to_dict (~g!getone id))}
          (except [e Exception]
            {"error" 1 "desc" (str e)})))))

(defmacro! update-route [prefix]
  `#@(db_session (defn ~g!update [id &kwargs kwargs]
                  (.set (. (. models [~prefix]) [id]) #** kwargs)))

  `#@((app.route (+ "/" ~prefix "/update") :methods ["POST"])
      (defn ~g!update_api []
        (try
          (setv [id rest] (dissoc-dict (. request json) "id"))
          (~g!update id #** rest)
          {"error" 0}
          (except [e Exception]
            {"error" 1 "desc" (str e)})))))

(defmacro! delete-route [prefix]
  `#@(db_session (defn ~g!delete [id]
                  (.delete (. (. models [~prefix]) [id]) )))

  `#@((app.route (+ "/" ~prefix "/delete") :methods ["POST"])
      (defn ~g!delete_api []
        (try
          (~g!delete (. request json ["id"]))
          {"error" 0}
          (except [e Exception]
            {"error" 1 "desc" (str e)})))))

(defmacro gen-routes [route]
  `(do
     (idx-route ~route)
     (getcols-route ~route)
     (create-route ~route)
     (getall-route ~route)
     (getone-route ~route)
     (update-route ~route)
     (delete-route ~route)))

(gen-routes "student")
(gen-routes "marks")
(.run app :debug True)

