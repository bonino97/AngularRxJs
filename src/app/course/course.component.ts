import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { combineLatest, Observable } from "rxjs";
import { map, tap, startWith } from "rxjs/operators";

import { Course } from "../model/course";
import { Lesson } from "../model/lesson";

import { CoursesService } from "../services/courses.service";

interface CourseData {
  course: Course;
  lessons: Lesson[];
}

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent implements OnInit {
  data$: Observable<CourseData>;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"));

    const course$: Observable<Course> = this.coursesService
      .loadCourseById(courseId)
      .pipe(startWith(<Course>null));

    const lessons$: Observable<Lesson[]> = this.coursesService
      .loadAllCourseLessons(courseId)
      .pipe(startWith([]));

    this.data$ = combineLatest([course$, lessons$]).pipe(
      map(([course, lessons]) => ({ course, lessons }))
    );
  }
}
