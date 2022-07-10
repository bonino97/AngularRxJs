import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { catchError, map, tap, shareReplay } from "rxjs/operators";

import { Course, sortCoursesBySeqNo } from "../model/course";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";

@Injectable({
  providedIn: "root",
})
export class CoursesStore {
  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {
    this.loadAllCourses();
  }

  private loadAllCourses(): void {
    const loadCourses$ = this.http.get<Course[]>("/api/courses").pipe(
      map((response) => response["payload"]),
      catchError((err) => {
        const message = "Could not load courses";
        this.messagesService.showErrors(message);
        console.error(message, err);
        return throwError(message);
      }),
      tap((courses) => this.subject.next(courses))
    );

    this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<Course> {
    const courses: Course[] = this.subject.getValue();
    const index = courses.findIndex((course) => course.id === courseId);

    const newCourse: Course = {
      ...courses[index],
      ...changes,
    };

    const newCourses: Course[] = courses.slice(0);

    newCourses[index] = newCourse;

    this.subject.next(newCourses);

    return this.http.put<Course>(`/api/courses/${courseId}`, changes).pipe(
      catchError((err) => {
        const message = "Could not save course";
        this.messagesService.showErrors(message);
        console.error(message, err);
        return throwError(message);
      }),
      shareReplay()
    );
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category === category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }
}
